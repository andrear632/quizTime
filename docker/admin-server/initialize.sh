#!/bin/bash
#This file is used to initialize some elements at statup

#wait for all the services to be online 
sleep 20

echo "\nEnd Sleep\n"

#purge old data
curl -w -X DELETE 'elasticsearch:9200/game'
curl -w -X DELETE 'elasticsearch:9200/questions'

echo "\nPurged Indexes\n"

#create needed indexes
curl -w -X PUT "elasticsearch:9200/game"
curl -w -X PUT "elasticsearch:9200/questions"

echo "\nCreated Indexes\n"

#create default entries
curl -w -X PUT -H "Content-Type:application/json" -d '{"nickname":"admin","score":0}' 'elasticsearch:9200/game/_doc/0'
curl -w -X PUT -H "Content-Type:application/json" -d '{"A":0, "B":0, "C":0, "D":0}' 'elasticsearch:9200/questions/_doc/0'

echo "\nCreated Default Entries\n"

#import dashboards in kibana
curl -w -X POST -H "kbn-xsrf: reporting" -H "Content-Type:application/json" -d "@kibana_dashboard_1.json" "kibana:5601/api/kibana/dashboards/import"
curl -w -X POST -H "kbn-xsrf: reporting" -H "Content-Type:application/json" -d "@kibana_dashboard_2.json" "kibana:5601/api/kibana/dashboards/import"

echo "\nDashboard Imported\n"