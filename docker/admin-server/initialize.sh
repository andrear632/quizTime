#!/bin/bash
#Questo file è comodo se devo initializzare delle componenti del server

curl -X DELETE 'elasticsearch:9200/game'
curl -X PUT "elasticsearch:9200/game?pretty"
curl -X DELETE 'elasticsearch:9200/questions'
curl -X PUT "elasticsearch:9200/questions?pretty"
curl -X POST -H "kbn-xsrf: reporting" -H "Content-Type:application/json" -d "@kibana_dashboard_1.json" "kibana:5601/api/kibana/dashboards/import"