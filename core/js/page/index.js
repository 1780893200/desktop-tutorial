// 用户信息
let userInfo = {
  token: "",
  userName: "",
  nickName: "",
  card:"",
  phone:"",
  isVip:false,
  showInpDes:false //用来控制个人信息输入框的显示
}

// 模态弹窗
let modal = {
  loginModal:"",
  burnModal:"",
  activationCodeModal:"",
  payModal:"",
  logIngModal:""
}
//分页
let page = {
  pageSize: 8,
  pageIndex: 1,
  total: 3,
  totalPage: 0
}

//当前的导航坐标
let navIndex = 0;

$(function (){
  //proxy 初始化
  proxyInit();
  // 初始化
  init();
  // 事件绑定
  initDom();
  // modal模态弹窗绑定
  initModal()
  // 获取是否有可升级版本
  getVersions()

  // modal.loginModal.show();


})
/**
 * @discription 初始化加载
 * */
function init(){
  userInfo = JSON.parse(localStorage.getItem("userInfo")) || {};
  // console.log('000',JSON.parse(localStorage.getItem("userInfo")) || {})
  // console.log(userInfo);
  // console.log(userInfoProxy);
  userInfoProxy.token = userInfo.token;
  userInfoProxy.nickName = userInfo.nickName;
  userInfoProxy.isVip = userInfo.isVip;
  userInfoProxy.userName = userInfo.userName;
  userInfoProxy.card = userInfo.card;
  userInfoProxy.phone = userInfo.phone;
  // 删除数据
  // localStorage.removeItem('userInfo');
}

/**
 * @discription 初始化模态弹窗
 * */
function initModal(){
  modal.loginModal = new bootstrap.Modal(document.getElementById('loginModal'), {});
  modal.burnModal = new bootstrap.Modal(document.getElementById('burnModal'), {});
  modal.activationCodeModal = new bootstrap.Modal(document.getElementById('activationCodeModal'), {});
  modal.hintModal = new bootstrap.Modal(document.getElementById('hintModal'), {});
  modal.payModal = new bootstrap.Modal(document.getElementById('payModal'), {});
  modal.personalModal = new bootstrap.Modal(document.getElementById('personalModal'), {});
  modal.logIngModal = new bootstrap.Modal(document.getElementById('logIngModal'), {});
}
function inpChangeBurnBaudRate(){
  $("#seBaudRateSel").attr("size",0);
}

/**
 * @discription 初始化事件绑定
 * */
function initDom(){
  $("#navTabs").on("click",".nav-item",function (){
    const type =  $(this).data("type");
    $("#navTabs .nav-item .nav-link").removeClass("active");
    $(this).find(".nav-link").addClass("active");
    $('.loginContent').hide();
    $(`.${type}`).css("display","flex");
  })

  $("#seBaudRate").on("click",function (){
    event.stopPropagation();
  })
  // 波特率输入框获取焦点
  $("#seBaudRate").on("focus",function (){
    event.stopPropagation();
    $("#seBaudRateSel").attr("size",5);
    $("#seBaudRateSel").css("top","40px");
  })


  $("#burnModal").on("click",function (){
    $("#seBaudRateSel").attr("size",0);
    $("#seBaudRateSel").css("top","0px");
  })
  // $("#seBaudRate").on("blur",function (){
  //   $("#seBaudRateSel").attr("size",0);
  //   $("#seBaudRateSel").css("top","0px");
  // })

  //切换展示
  $(".cutList").on("click",function (){
    const type =  $(this).data("type");
    if(navIndex !== type){
      $(this).addClass("nav-itemActive").siblings().removeClass("nav-itemActive");

      const str = type == "1"?'最新(烧录)':'最热热热热热热热(安装)';
      console.log("type",type)
      $(".contentWrap").empty();
      drawDevice("1",'../static/images/1717579189494.jpg',`${str}的标题`,`${str}的产品展示内容`,type);
      navIndex = type
    }
  })

  //登录
  $(".loginBut").on("click",function (){
    loginFun()
  })


  //激活
  $("#activationCodeBut").on("click",function (){
    // 查看是否登录
    if(!!userInfoProxy.token){
      $('.activationCodeHint').hide();
      modal.activationCodeModal.show();
    }else{
      // 没有登录去登录
      // setHintFun({text:"还未登录，去登录",confirmFun:"loginFun()",showCancel:false,confirmText:"去登陆"})
      loginFun()
    }
  })

  // 烧录/安装
  $("body").on("click",'.burnOpen',function (){
    // 查看是否登录
    if(!!userInfoProxy.token){
      // 初始化烧录烧录弹窗弹窗
      $('#burnHintText').text("").attr("class","")
      const serviceType = $(this).attr("data-serviceType");
      $('.burnValWrap').hide();$('.installValWrap').hide();
      serviceType == "1"?$('.burnValWrap').show():$('.installValWrap').show();
      $("#burnProgressBar").css("width","0%").text("0%");
      // 显示烧录烧录弹窗弹窗
      modal.burnModal.show();
      // 激活码初始化样式
      $("#activeInp").attr("class","form-control fs-6");
      if (userInfoProxy.isVip){
        $("#onceCard").hide();
        $("#memberCard").hide();
        $('.substitution').show();
      }
    }else{
      // 没有登录去登录
      // setHintFun({text:"还未登录，去登录",confirmFun:"loginFun()",showCancel:false,confirmText:"去登陆"})
      loginFun()
    }
  })

  // 烧录价格查看
  $(".burn-priceWrap").on("click",function (){
    $(this).addClass("burn-active").siblings().removeClass("burn-active");
    const price = +$(this).data("price");
    // $("#payPriceTitle").html(price > 0?'&nbsp':'扫码绑定IOT');
    $("#payPriceText").html(price > 0?'微信支付 微信扫码':'扫码绑定IOT');
    $("#payPrice").attr("data-price",price).html(price > 0?'￥ '+price:'&nbsp;');
  })

  // 会员
  $(".pay-priceWrap").on("click",function (){
    const price = +$(this).data("price");
    $(this).addClass("burn-active").siblings().removeClass("burn-active");
    $("#payMemberPrice").text(price);
  })

  // 切换登录账号
  $("#cutLoginBut").on("click",function (){
    setHintFun({text:"切换账号将会退出登录,确认切换登录账号？",confirmFun:"loginFun()",cancelText:"直接退出",cancelFun:"exitFun()",confirmText:"切换账号"})
  })

  // 个人信息
  $("#personalBut").on("click",function (){
    // 显示个人信息
    $('#authenticationRes').hide();
    $('.hintInpText').hide();
    $('.hintInpPhone').hide();
    $('.hintPersonalCode').hide();
    $('#personalCodeWrap').hide();
    
    $("#personalModal input").val("");
    $("#personalNick").val(userInfoProxy.nickName);
    $("#personalName").val(userInfoProxy.userName);
    $("#personalCord").val(userInfoProxy.card);
    $("#personalPhone").val(userInfoProxy.phone);
    if(userInfoProxy.card === ''){
      $("#authenticationBut").html(`认<span style="color: transparent">空</span>证`)
    }else{
      $("#authenticationBut").html(`重新认证`)
    }

    if(userInfoProxy.phone === ''){
      $("#changePhoneBut").html(`绑定手机号`)
    }else{
      $("#changePhoneBut").html(`更换手机号`)
    }

    userInfoProxy.showInpDes = true;
    modal.personalModal.show();
  })

  // 认证按钮
  $("body").on("click",'#authenticationBut',function (){
    $('.hintInpText').hide();
    const personalName = $("#personalName").val();
    const personalCord = $("#personalCord").val();
    if(personalName === ""){
      $(".personalNameHint").show();
      return;
    }
    if(personalCord.length !== 18){
      $(".personalCordHint").show();
      return;
    }
    $("#authenticationBut").html("认证中").prop("disabled",true);
    setTimeout(()=>{
      const r = Math.random()*10;
      if(r > 5){
        $('#authenticationRes').show().removeClass("text-success").addClass("text-danger").text('认证失败')
        $("#authenticationBut").html('认<span style="color: transparent">空</span>证').prop("disabled",false);
      }else{
        $('#authenticationRes').show().removeClass("text-danger").addClass("text-success").text('认证成功')
        $("#authenticationBut").html("已认证").prop("disabled",true);
        userInfoProxy.userName = personalName;
        userInfoProxy.card = personalCord;
      }
    },1000)
  })

  // 昵称
  $("#personalNick").on("blur",function (){
    userInfoProxy.nickName = $(this).val();
  })

  // 修改手机号
  $("#changePhoneBut").on("click",function (){
    const phone = $('#personalPhone').val();
    const hintInpPhoneTextDom =  $('.hintInpPhoneText');
    $(".hintInpPhone").hide();
    if(registerPhone(phone)){
      // userInfoProxy.phone = phone;
      $("#personalCodeWrap").css("display","flex");
    }else{
      $('.hintInpPhone').show();
      hintInpPhoneTextDom.removeClass('text-success').addClass('text-danger').text('请输入正确手机号')
    }
  })

  // 验证码 验证码
  $("#personalCodeBut").on("click",function (){
    const personalCode = $('#personalCode').val();
    const hintPersonalCodeText = $('.hintPersonalCodeText');
    if(personalCode.length > 0){
      userInfoProxy.phone = $('#personalPhone').val();
      $(".hintPersonalCode").show();
      hintPersonalCodeText.removeClass('text-danger').addClass('text-success').text('手机号修改成功');
    }else{
      $(".hintPersonalCode").show();
      hintPersonalCodeText.removeClass('text-success').addClass('text-danger').text('请输入验证码');
    }
  })

  // 烧录按钮
  $("#burnStartBut").on("click",function (){
    const seCOM = $("#seCOM").val();
    const seBaudRate = $("#seBaudRate").val();

    $("#burnProgressBar").css("width","100%").text("100%");
    $("#burnHintText").text("烧录成功").attr("class","text-success");
  })

  // 执行按钮
  $('#executeStartBut').on("click",function (){
    $("#burnProgressBar").css("width","100%").text("100%");
    $("#burnHintText").text("执行成功").attr("class","text-success");
  })

  //升级
  $("body").on("click",".upgradeBut",function (){
    // if(userInfoProxy.isVip){
    //   setHintFun({text:"您已经是会员了"})
    //   return;
    // }
    modal.payModal.show();
  })

  //01.分页
  $('body').on("click",".pageNum",function (){
    const pageNum =  $(this).data('num');
    console.log("pageNum",pageNum)

    if(pageNum == '-'){
      console.log("page.pageIndex----",page.pageIndex)
      page.pageIndex--;
    }else if(pageNum == '+'){
      console.log("page.pageIndex++++",page.pageIndex)
      page.pageIndex++;
    }else {
      page.pageIndex = +pageNum;
      console.log("page.pageIndex00000000",page.pageIndex)
    }
    page.pageIndex = Math.min(Math.max(page.pageIndex,1),page.total);

    $(".contentWrap").empty();
    drawDevice("1",'../static/images/1717579189494.jpg',`分页的产品${page.pageIndex}页`,`分页的产品展示内容${page.pageIndex}页`);
  })

  // 烧录 激活码
  $('#activeInpBut').on("click",function (){
    const val = $("#activeInp").val();
    if(val !== ''){
      $('#onceCard').hide();
      $('.substitution1').show();
      $("#burnHintText").text('激活成功').attr("class","text-success");
      $("#activeInp").attr("class","form-control fs-6 border border-success")
      $(this).attr("class","btn btn-success").html("已激活")
    }else{
      $("#activeInp").attr("class","form-control fs-6 border border-danger")
    }
  })

}

/**
 * @discription 登录
 * */
function loginSuc(){
  // 登陆清楚上一次登陆的信息
  exitFun();

  userInfoProxy.token = "token";
  userInfoProxy.nickName = "admin";
  userInfoProxy.isVip = false;
  $(".contentWrap").empty();
  drawDevice("1",'../static/images/1717579189494.jpg',"已登录的产品","已登录的产品展示内容");
  modal.loginModal.hide()
}

/**
 *#name 手机号登录
 * */
function loginPhoneSuc() {
  const loginPhone = $("#loginPhone").val();
  const loginPhpneCode = $("#loginPhone").val();
  if(loginPhone === ''){
    $('.loginPhoneHint').show();
    $(".loginPhoneHintText").addClass('text-danger').text("请输入正确手机号");
    return;
  }
  if(loginPhpneCode === ''){
    $('.loginPhoneCodeHint').show();
    $(".loginPhoneCodeHintText").addClass('text-danger').text("请输入正确验证码");
    return;
  }
  loginSuc()

}

/*
* @name 获取手机验证码*/
function getPhoneCode(id){
  const phone = $(`#${id}`).val();
  $('.loginPhoneHint').hide()
  if(registerPhone(phone)){

  }else{
    $('.loginPhoneHint').show()
    $(".loginPhoneHintText").addClass('text-danger').text("请输入正确手机号");
  }
}

/**
 * @discription 可以烧录
 * */
function burnOk(){
  // jq修改disabled状态
  const price = $("#payPrice").attr('data-price');
  if(price == 15){
    $('#onceCard').hide();
    $('.substitution1').show();
  }else if(price == 99){
    $('#onceCard').hide();
    $('#memberCard').hide();
    $('.substitution').show();
    userInfoProxy.isVip = true;
  }
  $(".burn-priceWrap").eq(0).trigger("click")
}

/**
 * @name 激活码
 * */
function confirmActivationCode(){
  const val = $("#activationCodeValue").val();
  if(val === ''){
    $(".activationCodeHint").show().removeClass('text-success').addClass('text-danger').text("请输入激活码");
    return;
  }
  // 模拟激活码
  const random = Math.random() * 10;
  if(random > 7){
    $(".activationCodeHint").show().removeClass('text-danger').addClass('text-success').text("成功激活");
    setTimeout(()=>{
      modal.activationCodeModal.hide();
      drawDevice(val,'../static/images/1717579189494.jpg',"这里是标题"+val,"这里是描述"+val);
    },1000)
  }else{
    $(".activationCodeHint").show().removeClass('text-success').addClass('text-danger').text("激活码错误");
    // setHintFun({text:"激活码错误",confirmFun:""})
  }
}



/*
* @name 画设备
* @param id 设备id
* @param img 设备图片
* @param title 设备名称
* @param des 设备描述
* @param serviceType 设备服务类型
* */

function drawDevice(id,img,title,des,serviceType) {
  // 画设备
  let str = `<div class="contentWrap-item card">
      <div class="w-100 itemImg-wrap position-relative">
        <img class="h-100 w-100" src="${img}">
        <div class="burn-mask w-100 h-100 position-absolute justify-content-center align-items-center flex-column">
          <div class="but-circleBut d-flex justify-content-center align-items-center flex-column burnOpen" data-id="${id}" data-serviceType="${serviceType}">
            <p class="iconfont icon-shaolugongju text-white fs-4"></p>
            <p class="text-white  burn-text fs-5">烧录</p>
          </div>
        </div>
      </div>
      <div class="w-100 itemImg-text">
        <p class="fontBold fs-5">${title}</p>
        <p class="text_p fs-6">${des}</p>
      </div>
    </div>`
  $(".contentWrap").append(str);
}

/*
* @description 提示弹窗确认按钮
* */
function hintConfirm(){
  const evalSrt = $("#hintText").attr("data-evalStr");
  if(evalSrt){
    eval(evalSrt);
  }
}

/*
* @description 提示弹窗取消按钮
* */
function hintCancel(){
  const evalCancelStr = $("#hintText").attr("data-evalCancelStr");
  if(evalCancelStr){
    eval(evalCancelStr);
  }
}

/**
 * @discription 登录
 * */
function loginFun() {
  modal.loginModal.show();
}

/*
* @discription 退出登录
* */
function exitFun(){
  userInfoProxy.token = "";
  userInfoProxy.nickName = "";
  userInfoProxy.isVip = false;
  localStorage.removeItem('userInfo');
  $(".contentWrap").empty();
  drawDevice("1",'../static/images/1717579189494.jpg',"未登录的产品","未登录的产品展示内容");
}

// 检测更新
function detectioUpdate(){
  setHintFun({text:"是否进行版本升级？",confirmFun:"unDateVersion()",cancelText:"忽略此版本",confirmText:"确认升级"})
}

// 更新版本成功
function unDateVersion(){
  setHintFun({text:"恭喜您升级成功？",showCancel:false,confirmFun:'$("#upVersionsBut").hide()'});
}

// 获取升级信息
function getVersions(){
  // 模拟是否有更新
  const r = Math.random() * 10;
  $("#upVersionsBut").toggle(r > 8);
}

//升级
function payOk(){
  setHintFun({text:"恭喜您成为会员","confirmFun":""});
  modal.payModal.hide();
  userInfoProxy.isVip = true;
}

//解绑微信
function unbundleWx(){
  $('.vwBundleNo').css("display","flex");
  $('.vwBundleOk').hide();
}

// 绑定微信
function bundleWx(){
  $('.vwBundleOk').css("display","flex");
  $('.vwBundleNo').hide();
}

//购买激活码
function buyActivationCode(){
  // $("#showBuyActivationCode").css("display","flex");
  openHttp('https://shop155111207.taobao.com/category.htm?spm=a1z10.1-c-s.w4010-17334232015.2.3d2e2806NwcM2i&search=y')
}

// 购买激活码成功
function buyActivationCodeOk(){
  // 随机数激活码6位数
  const code = String(Math.floor(Math.random() * 999999) + 100000).padStart(6,'0');
  $("#showBuyActivationCode").hide();
  $("#activationCodeValue").val(code)
}

/*波特率下拉选*/
function changeBurnBaudRate(val){
  event.stopPropagation();
  $("#seBaudRate").val(val);
  $("#seBaudRateSel").attr("size",0);
  $("#seBaudRateSel").css("top","0px");
  // if(val == -1){
  //   // modal.burnModal.hide();
  //   setHintFun({text:` <span>请输入波特率:</span> <input type="text" id="baudRateInput" class="border" >`,showCancel:false,confirmFun:"getBaudRateInput()"})
  // }
}

/***/
// function seBaudRateSelFocus(){
//   console.log("11111")
//   setTimeout(()=>{
//     $("#seBaudRate").focus();
//   },500)
// }

/*波特率下拉选*/
function getBaudRateInput(){
  const baudRateInput = $("#baudRateInput").val();
  if(baudRateInput === ""){
    $("#seBaudRate").val(0)
  }else {
    $("#seBaudRate").append(`<option value="${baudRateInput}">${baudRateInput}</option>`).val(baudRateInput);
  }
}

// 打开日志
function openlogIng(){
  modal.logIngModal.show();
  $("#logIngContent").empty();
  let str = `   <div class="w-100">2024/06/25 11:11:11 kkkkkkkkk模块烧录错误【错误原因:xxxxxxxxxxxxxxxxxxxxxxxxxxxxx】</div>
                <div>2024/06/25 11:11:11 kkkkkkkkk模块烧录错误kkkkkkkkk模块烧录错误kkkkkkkkk模块烧录错误kkkkkkkkk模块烧录错误kkkkkkkkk模块烧录错误kkkkkkkkk模块烧录错误</div>
                <div>2024/06/25 11:11:11 kkkkkkkkk模块烧录错误【错误原因:xxxxxxxxxxxxxxxxxxxxxxxxxxxxx】</div>
                <div>2024/06/25 11:11:11 kkkkkkkkk模块烧录错误【错误原因:xxxxxxxxxxxxxxxxxxxxxxxxxxxxx】</div>
                <div>2024/06/25 11:11:11 kkkkkkkkk模块烧录错误【错误原因:xxxxxxxxxxxxxxxxxxxxxxxxxxxxx】</div>
                <div>2024/06/25 11:11:11 kkkkkkkkk模块烧录错误【错误原因:xxxxxxxxxxxxxxxxxxxxxxxxxxxxx】</div>`
  $("#logIngContent").html(str);
}

