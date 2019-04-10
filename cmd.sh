alias hostse="sudo vim /etc/hosts"
alias bashe="open ~/.bash_profile -a atom"
alias bashu="source ~/.bash_profile"
alias ll="ls -al"
alias e="open -a atom "

dnsmasq_reload()
{
  sudo cp "$(brew list dnsmasq | grep /homebrew.mxcl.dnsmasq.plist$)" /Library/LaunchDaemons/
  launchctl unload /Library/LaunchDaemons/homebrew.mxcl.dnsmasq.plist
  launchctl load /Library/LaunchDaemons/homebrew.mxcl.dnsmasq.plist
  dscacheutil -flushcache
  launchctl stop homebrew.mxcl.dnsmasq
  launchctl start homebrew.mxcl.dnsmasq
}
dnsmasq_add_me()
{
  if [ "$1" ]
  then
    sudo mkdir -p /etc/resolver
    domain="$1"
    filepath="/etc/resolver/$domain"
    sudo rm $filepath
    sudo touch $filepath
    sudo echo "nameserver 127.0.0.1" > $filepath
    sudo echo "domain $domain" >> $filepath
    sudo echo "search_order 1" >> $filepath
  else
    echo "Please provide domain"
  fi
}
kill_port()
{
  lsof -n -i4TCP:$1 | grep LISTEN | awk '{ print $2 }' | xargs kill -9 > /dev/null 2>&1
}
