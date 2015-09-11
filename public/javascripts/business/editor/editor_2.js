$(document).ready(function() {
    // 总编辑类
    var edit = function() {
        _ethis = this;
        _ethis._editor = null;
        _ethis._pos = 0;
        _ethis._userop = new cursorControl(document.getElementById('eblock_con'));
    };
    edit.prototype = {

        // 初始化
        _init: function() {
            _ethis._op();
            // _ethis._editinit();
        },

        // 实践操作
        _op: function() {
            // 界面滚动
            $(window).scroll(function() {
                _ethis._editpanel();
            });

            // 弹出框
            $(".modalbtn").click(function() {
                _ethis._showmodal($(this));
            });

            // 图片上传
            $(".add_pic_btn").click(function() {
                $(".addimage").click();
            });

            $(".addimage").change(function() {
                var file = $(".addimage")[0].files[0];
                var fileName = file.name.substring(0, file.name.lastIndexOf('.'));
                var fileType = file.type;
                $(".add_pic_btn").text(fileName);
                if (fileType != "image/jpeg" && fileType != "image/png" && fileType != "image/jpg") {
                    alert("文件类型错误");
                }
            });

            $(".picmodal .cancel").click(function() {
                _ethis._picmodal_cancel();
            });
            $(".picmodal .sure").click(function() {
                _ethis._picmodal_sure();
            });

            $(".urlmodal .sure").click(function() {
                _ethis._urlmodal_sure();
            });
            $(".urlmodal .cancel").click(function() {
                _ethis._urlmodal_cancel();
            });
        },

        _showmodal: function(ele) {
            var type = ele.data('type');
            switch (type) {
                case 'picture':
                    _ethis._picmodal();
                    break;
                case 'link':
                    _ethis._urlmodal();
                    break;
                default:
                    break;
            };
        },

        // 显示图片上传
        _picmodal: function() {
            $(".picmodal").show();
        },

        // 确定按钮
        _picmodal_sure: function() {
            var file = $(".addimage")[0].files[0];
            if (file == null) {
                alert("请添加文件");
            } else {
                var fileName = file.name.substring(0, file.name.lastIndexOf('.'));
                var fileType = file.type;
                if (fileType != "image/jpeg" && fileType != "image/png" && fileType != "image/jpg") {
                    alert("文件类型错误");
                } else {
                    _ethis._uploadimage();
                }
            }
        },
        _uploadimage: function() {
            var this_imagefile = "addimage";
            $.ajaxFileUpload({
                url: '/editor/upload',
                fileElementId: this_imagefile,
                dataType: 'json',
                success: function(data, textStatus) {
                    if (data.error === "") {
                        var imageUrl = data.filePath;
                        var str = "<div><img src='" + imageUrl + "'></div>";
                        _ethis._userop.insertText(str);
                        _ethis._picmodal_cancel();
                    } else {
                        alert("上传错误!");
                    }
                },
                error: function(XMLHttpRequest, textStatus, error) {
                    console.log(error);
                }
            });
        },


        // 取消按钮
        _picmodal_cancel: function() {
            $(".picmodal").hide();
            $(".addimage").val('');
            $(".add_pic_btn").text("添加");
        },

        // URL地址
        _urlmodal: function() {
            $(".urlmodal").show();
        },

        _urlmodal_sure: function() {
            var url = $(".modal_url").val();
            var title = $(".modal_urldec").val();
            var isok = false;
            if (url == "" || title == "") {
                alert("请补全");
            } else {
                if (url.substring(0, 7) != "http://" & url.substring(0, 8) != "https://") {
                    url = "http://" + url;
                }
                var str = "<a href='" + url + "' target='_blank' class='editor_a'>" + title + "</a>";
                _ethis._urlmodal_cancel();
            }
        },

        // 关闭modal
        _urlmodal_cancel: function() {
            $(".modal_url").val('');
            $(".modal_urldec").val('');
            $(".urlmodal").hide();
        }
    };


    var cursorControl = function(a) {
        _cthis = this;
        _cthis.element = a;
        _cthis.range = !1;
        _cthis.start = 0;
        _cthis.init();
    };

    cursorControl.prototype = {
        init: function() {
            var _fthis = _cthis;
            _cthis.element.onkeyup = this.element.onmouseup = function() {
                this.focus();
                if (document.all) {
                    _fthis.range = document.selection.createRange();
                } else {
                    _fthis.start = _fthis.getStart();
                }
            }
        },
        getType: function() {
            return Object.prototype.toString.call(_cthis.element).match(/^\[object\s(.*)\]$/)[1];
        },
        getStart: function() {
            if (_cthis.element.selectionStart || _cthis.element.selectionStart == '0') {
                return _cthis.element.selectionStart;
            } else {
                if (window.getSelection) {
                    var rng = window.getSelection().getRangeAt(0).cloneRange();
                    rng.setStart(_cthis.element, 0);
                    return rng.toString().length;
                }
            }
        },
        insertText: function(text) {
            _cthis.element.focus();
            if (document.all) {
                document.selection.empty();
                _cthis.range.text = text;
                _cthis.range.collapse();
                _cthis.range.select();
            } else {
                if (_cthis.getType() == 'HTMLDivElement') {
                    _cthis.element.innerHTML = _cthis.element.innerHTML.substr(0, _cthis.start) + text + _cthis.element.innerHTML.substr(_cthis.start);
                } else {
                    _cthis.element.value = _cthis.element.value.substr(0, _cthis.start) + text + _cthis.element.value.substr(_cthis.start);
                }
            }
        },
        getText: function() {
            if (document.all) {
                var r = document.selection.createRange();
                document.selection.empty();
                return r.text;
            } else {
                if (_cthis.element.selectionStart || _cthis.element.selectionStart == '0') {
                    var text = _cthis.getType() == 'HTMLDivElement' ? _cthis.element.innerHTML : _cthis.element.value;
                    return text.substring(_cthis.element.selectionStart, _cthis.element.selectionEnd);
                } else {
                    if (window.getSelection) {
                        return window.getSelection().toString();
                    }
                }
            }
        }
    };


    var newedit = new edit();
    newedit._init();
});