TAG := $(shell tar -cf - . | md5sum | cut -f 1 -d " ")
PROJECT := personal-website

run: own docker_build mm_server
build: own docker_build mm_classes mm_build

docker_build:
	docker build -t charlieegan3.com .
mm_server: docker_build
	docker run -it -v "$$(pwd):/app" -p 4567:4567 charlieegan3.com bash -c "middleman server"
mm_build: docker_build
	docker run -it -v "$$(pwd):/app" charlieegan3.com bash -c "middleman build"
mm_classes: docker_build
	docker run -it -v "$$(pwd):/app" charlieegan3.com bash -c "./bin/find_used_classes"
open:
	firefox http://localhost:4567
own:
	sudo chown -R $$(whoami) *

build_prod:
	docker build -t charlieegan3/$(PROJECT):latest -t charlieegan3/$(PROJECT):${TAG} -f Dockerfile.prod .

push: build_prod
	docker push charlieegan3/$(PROJECT):latest
	docker push charlieegan3/$(PROJECT):${TAG}
