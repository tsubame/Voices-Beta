.PHONY: clean

clean:
	rm -rf ../mysqldata
	mkdir ../mysqldata
	docker compose up mysql
	docker compose up
