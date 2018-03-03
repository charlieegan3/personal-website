run: docker_build mm_server
build: docker_build mm_build

docker_build:
	docker build -t charlieegan3.com .
mm_server:
	docker run -it -v "$$(pwd):/app" -p 4567:4567 charlieegan3.com middleman server
mm_build:
	docker run -it -v "$$(pwd):/app" charlieegan3.com middleman build
open:
	firefox http://localhost:4567
