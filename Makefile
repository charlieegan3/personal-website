TAG := $(shell tar -cf - . | md5sum | cut -f 1 -d " ")
PROJECT := personal-website
REPO := docker.io/charlieegan3/$(PROJECT)

build:
	docker build -t $(REPO):latest -t $(REPO):${TAG} .

push: build
	docker push $(REPO):${TAG}
	docker push $(REPO):latest

build_arm:
	docker build -t $(REPO):arm-${TAG} -f Dockerfile.arm .

push_arm: build_arm
	docker push $(REPO):arm-${TAG}
