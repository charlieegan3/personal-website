TAG := $(shell tar -cf - . | md5sum | cut -f 1 -d " ")
PROJECT := personal-website
REPO := quay.io/charlieegan3/$(PROJECT)

build:
	docker build -t $(REPO):latest -t $(REPO):${TAG} .

push: build
	docker push $(REPO):${TAG}
	docker push $(REPO):latest
