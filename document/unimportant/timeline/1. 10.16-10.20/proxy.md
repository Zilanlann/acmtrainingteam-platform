export hostip=$(cat /etc/resolv.conf |grep -oP '(?<=nameserver\ ).*');

export https_proxy="http://${hostip}:7890";

export http_proxy="http://${hostip}:7890";

alias checkp='echo "https_proxy=${https_proxy}, http_proxy=${http_proxy};";'

alias setp='export https_proxy="http://${hostip}:7890";export http_proxy="http://${hostip}:7890";echo "Set https_proxy and http_proxy http://${hostip}:7890";'

alias unsetp='unset http_proxy;unset https_proxy;echo "Unset proxy successfully.";'