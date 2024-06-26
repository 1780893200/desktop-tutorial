let userInfoProxy;
function proxyInit(){
// 代理 userInfo 的改变
  userInfoProxy = new Proxy(userInfo,{
    set: function(target, property, value) {
      switch (property){
        case 'token':
          $("#loginBut").toggle(!value);
          $(".userInfoDes-textHint").toggle(!value);
          $(".userInfoDes-text").toggle(!!value);
          break;
        case 'isVip':
          $("#vipIcon").toggle(!!value);
          $("#memberCard").toggle(!value);
          break;
      }
      target[property] = value;
      localStorage.setItem('userInfo', JSON.stringify(target));
      return true;
    },
  })
}