#!/bin/bash
#This file is used to initialize some elements at statup

#wait for all the services to be online 
sleep 20

echo "End Sleep"

#purge old data
curl -w -X DELETE 'elasticsearch:9200/game'
curl -w -X DELETE 'elasticsearch:9200/questions'

echo "Purged Indexes"

#create needed indexes
curl -w -X PUT "elasticsearch:9200/game"
curl -w -X PUT "elasticsearch:9200/questions"

echo "Created Indexes"

#create default entries
curl -w -X PUT -H "Content-Type:application/json" -d '{"nickname":"admin","score":0}' 'elasticsearch:9200/game/_doc/0'
curl -w -X PUT -H "Content-Type:application/json" -d '{}' 'elasticsearch:9200/questions/_doc/0'

echo "Created Default Entries"

#import dashboards in kibana
curl -w -X POST -H "kbn-xsrf: reporting" -H "Content-Type:application/json" -d "@kibana_dashboard_1.json" "kibana:5601/api/kibana/dashboards/import"
curl -w -X POST -H "kbn-xsrf: reporting" -H "Content-Type:application/json" -d "@kibana_dashboard_2.json" "kibana:5601/api/kibana/dashboards/import"

echo "Dashboard Imported"