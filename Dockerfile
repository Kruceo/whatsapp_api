FROM rafola/puppeteer

run apt update -y 
run apt install git -y
# run npm i puppeteer -g
WORKDIR /whatsapp_api
run echo "rm -r whatsapp_api" >> start.sh
run echo "echo 'removed trash'" >> start.sh
run echo "git clone https://github.com/Kruceo/whatsapp_api.git whatsapp_api" >> start.sh
run echo "echo 'repo cloned'" >> start.sh
run echo "cd whatsapp_api" >> start.sh
run echo "echo 'joining folder'" >> start.sh
run echo "mv * .. && cd .." >> start.sh
run echo "echo 'replaced files' && ls -a" >> start.sh
# run echo "npm i" >> start.sh
run echo "node index.mjs -cf /tmp/whatsapp_api" >> start.sh


COPY ./node_modules ./node_modules
# WORKDIR /
ENTRYPOINT [ "/bin/bash","start.sh" ]