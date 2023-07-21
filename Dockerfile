FROM rafola/puppeteer

run apt update -y 
run apt install git -y
run echo "git clone https://github.com/Kruceo/whatsapp_api.git whatsapp_api" >> start.sh
ENTRYPOINT [ "/bin/bash","start.sh" ]
