package main

import (
	"context"
	"fmt"
	"github.com/charlieegan3/toolbelt/pkg/database"
	"github.com/spf13/viper"
	"log"
	"os"
	"os/signal"
	"syscall"

	websiteTool "github.com/charlieegan3/personal-website/pkg/tool"
	"github.com/charlieegan3/toolbelt/pkg/tool"
)

func main() {
	viper.SetConfigName("config")
	viper.SetConfigType("yaml")
	viper.AddConfigPath(".")
	err := viper.ReadInConfig()
	if err != nil {
		log.Fatalf("Fatal error config file: %s \n", err)
	}

	cfg, ok := viper.Get("tools").(map[string]interface{})
	if !ok {
		log.Fatalf("failed to read tools config in map[string]interface{} format")
		os.Exit(1)
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

	// init the toolbelt, connecting the database, config and external runner
	tb := tool.NewBelt()
	tb.SetConfig(cfg)
	tb.SetDatabase(db)

	wt := websiteTool.Website{}
	err = tb.AddTool(ctx, &wt)
	if err != nil {
		log.Fatalf("failed to add tool: %v", err)
	}

	fmt.Println("starting server")
	tb.RunServer(ctx, "0.0.0.0", "3000")
}
