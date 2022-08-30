#!/bin/bash
#This file is used to initialize some elements at statup

#wait for all the services to be online 
sleep 20

#purge old data
curl -X DELETE 'elasticsearch:9200/game'
curl -X DELETE 'elasticsearch:9200/questions'

#create needed indexes
curl -X PUT "elasticsearch:9200/game"
curl -X PUT "elasticsearch:9200/questions"

#create default entries
curl -X PUT -H "Content-Type:application/json" -d '{"nickname":"admin","score":0}' 'elasticsearch:9200/game/_doc/0'
curl -X PUT -H "Content-Type:application/json" -d '{}' 'elasticsearch:9200/questions/_doc/0'

#import dashboards in kibana
curl -X POST -H "kbn-xsrf: reporting" -H "Content-Type:application/json" -d "@kibana_dashboard_1.json" "kibana:5601/api/kibana/dashboards/import"
#curl -X POST -H "kbn-xsrf: reporting" -H "Content-Type:application/json" -d "@kibana_dashboard_2.json" "kibana:5601/api/kibana/dashboards/import"