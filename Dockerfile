FROM rafola/puppeteer

run apt update -y 
run apt install git -y
run npm i puppeteer -g
COPY ./node_modules ./node_modules
run echo "rm -r whatsapp_api" >> start.sh
run echo "git clone https://github.com/Kruceo/whatsapp_api.git whatsapp_api" >> start.sh
run echo "cd whatsapp_api" >> start.sh
# run echo "npm i" >> start.sh
run echo "node index.mjs" >> start.sh
ENTRYPOINT [ "/bin/bash","start.sh" ]