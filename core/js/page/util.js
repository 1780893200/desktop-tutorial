
/**
 * @discription 提示
 * @param {object} data
 * @param {string} data.text 提示文字
 * @param {string} [data.confirmFun] 确认执行的方法
 * @param {string} [data.cancelFun = closeFun] 取消执行的方法
 * @param {boolean} [data.showCancel = true]  显示取消按钮
 * @param {string} [data.cancelText='取消']  取消按钮文字
 * @param {string} [data.confirmText='确认']  确认按钮文字
 * */
function setHintFun(data){
  // console.log(data);
  // console.log(data.text);
  // console.log(data.confirmFun);
  // console.log(data.cancelFun);
  // console.log(data.showCancel);
  // console.log(data.cancelText);
  // console.log(data.confirmText);
  const param = {
    text:data.text,
    confirmFun:data.confirmFun === undefined?"":data.confirmFun,
    cancelFun:data.cancelFun === undefined?"":data.cancelFun,
    showCancel:data.showCancel === undefined?true:data.showCancel,
    cancelText:data.cancelText === undefined?'取消':data.cancelText,
    confirmText:data.confirmText === undefined?'确认':data.confirmText,
  }
  modal.hintModal.show();
  const hintTextDom = $("#hintText");
  hintTextDom.html(param.text).attr("data-evalStr","").attr("data-evalStr",param.confirmFun);
  hintTextDom.attr("data-evalCancelStr","").attr("data-evalCancelStr",param.cancelFun);
  $("#cancelBut").toggle(param.showCancel).html(param.cancelText);
  $("#confirmBut").html(param.confirmText);
}

/*
* @description 清除输入框 并清空提示
* @param {string} id 输入框id
* */
function clearInput(id){
  $(`#${id}Value`).val("");
  $(`.${id}Hint`).hide().val("");
}


/**
 * @name 验证手机号
 * */
function registerPhone(phone){
  const reg = /^1[3456789]\d{9}$/;
  return reg.test(phone);
}
