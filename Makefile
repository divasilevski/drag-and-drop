build:
	docker build -t ddimage .
run:
	docker run -p 3000:3000 --rm --name ddcontainer ddimage
stop:
	docker stop ddcontainer