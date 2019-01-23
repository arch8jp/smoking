#!/bin/bash
cd /home/ec2-user/repos/smorking
npm install
npm run build

cp ./hooks/smorking.service /etc/systemd/system/smorking.service
/usr/bin/systemctl enable smorking