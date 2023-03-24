package main

import (
	"context"
	"log"
	"os"
	"os/signal"
	"strings"
	"syscall"

	"github.com/charlieegan3/toolbelt/pkg/database"
	"github.com/spf13/viper"

	"github.com/charlieegan3/personal-website/pkg/tool/jobs"
)

func main() {
	viper.SetConfigName("config")
	viper.SetConfigType("yaml")
	viper.AddConfigPath(".")
	err := viper.ReadInConfig()
	if err != nil {
		log.Fatalf("Fatal error config file: %s \n", err)
	}

	// configure global cancel context
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	c := make(chan os.Signal, 1)
	signal.Notify(c, os.Interrupt, syscall.SIGINT, syscall.SIGTERM)
	go func() {
		select {
		case <-c:
			cancel()
		}
	}()

	// load the database configuration
	params := viper.GetStringMapString("database.params")
	connectionString := viper.GetString("database.connectionString")
	db, err := database.Init(connectionString, params, params["dbname"], false)
	if err != nil {
		log.Fatalf("failed to init DB: %s", err)
	}
	db.SetMaxOpenConns(1)
	defer db.Close()

	bucketName := viper.GetString("tools.personal-website.storage.bucket_name")
	googleJSON := viper.GetString("tools.personal-website.google.json")

	if len(os.Args) < 2 {
		log.Fatalf("missing source path")
	}

	sectionRef := ""
	if len(os.Args) > 2 {
		sectionRef = os.Args[2]
	}

	job := jobs.Import{
		DB:                    db,
		GoogleCredentialsJSON: googleJSON,
		BucketName:            bucketName,
		SourcePath:            strings.TrimSuffix(os.Args[1], "/"),
		SectionRef:            sectionRef,
	}

	err = job.Run(ctx)
	if err != nil {
		log.Fatalf("failed to run job: %s", err)
	}
}
