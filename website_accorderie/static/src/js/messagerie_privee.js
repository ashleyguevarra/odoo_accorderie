odoo.define('website.accorderie.messagerie_privee.instance', function (require) {
    'use strict';

    require('web_editor.ready');
    let Messagerie = require('website.accorderie.messagerie_privee');

    let $messagerie = $('.chat_box');
    if (!$messagerie.length) {
        // $("body").bind("DOMNodeInserted", function () {
        //     $(this).find('.o_thread_window.o_in_home_menu').addClass('d-none');
        // });
        return null;
    }

    let instance = new Messagerie();
    return instance.appendTo($messagerie).then(function () {
        return instance;
    });
});

//==============================================================================

odoo.define("website.accorderie.messagerie_privee", function (require) {

    let ajax = require('web.ajax');
    let Widget = require('web.Widget');
    let chatBody = document.getElementsByClassName("chat_body");

    let Messagerie = Widget.extend({
        start: function () {
            let self = this;
            // self.startRandom();

            // $('body').on('DOMNodeInserted', '.o_thread_window', function () {
            //     let liveChat = $('.o_thread_window.o_in_home_menu').detach().appendTo(".chat_body");
            //     liveChat.removeClass("o_thread_window o_in_home_menu");
            //     $('.o_thread_window_header').remove();
            //
            // });
            //
            // $('body').on('DOMNodeInserted', '.o_mail_thread_content', function () {
            //     let myMessage = true;
            //
            //     let newMessage = $('.o_thread_message.o_mail_discussion');
            //     newMessage.addClass('chat_msg');
            //
            //     newMessage.each(function (i) {
            //
            //         let avatar = $(this).find('.o_thread_message_avatar');
            //
            //         if(avatar.length > 0) {
            //             let attr = avatar.attr('data-oe-model');
            //
            //             // check if our message our their message
            //             if (typeof attr !== 'undefined' && attr !== false) {
            //                 myMessage = false;
            //             } else {
            //                 myMessage = true;
            //             }
            //         }
            //
            //
            //         if (myMessage) {
            //             console.log($(this).find('.o_thread_message_avatar').attr('data-oe-model'));
            //             $(this).children('.o_thread_message_core').addClass('msg my_msg');
            //             $(this).children('.o_thread_message_sidebar').addClass('d-none');
            //         } else {
            //             $(this).children('.o_thread_message_core').addClass('msg their_msg');
            //             $(this).children('.o_thread_message_sidebar').addClass('contact_pic');
            //             console.log("theirs");
            //         }
            //     });
            // });
        },

        startRandom: function() {
            let self = this;
            setInterval(function () {

                console.log("generate");
                let text = Math.floor(Math.random() * 2);
                const scroller = chatBody[0];
                let shouldScroll = scroller.scrollTop + scroller.clientHeight === scroller.scrollHeight;
                if (text) {
                    self.generateMyText();
                } else {
                    self.generateTheirText();
                }

                if (!shouldScroll) {
                    console.debug("scroll");
                    scroller.scrollTop = scroller.scrollHeight;
                }
            }, 3000);
        },

        generateMyText: function () {
            // message text
            let newMessageBody = document.createElement("div");
            newMessageBody.className += "my_msg msg";
            let newMessageText = document.createTextNode(this.generateRandomMessage());
            newMessageBody.appendChild(newMessageText);

            // message time
            let newTime = document.createElement("div");
            newTime.className += "msg_time text-right";
            let newTimeText = document.createTextNode("3 semaines");
            newTime.appendChild(newTimeText);

            // message container
            let newMessage = document.createElement("div");
            newMessage.className += "chat_msg";
            newMessage.appendChild(newMessageBody);
            newMessage.appendChild(newTime);

            // add to chat-box
            chatBody[0].appendChild(newMessage);
        },

        generateTheirText: function () {
            // message text
            let newMessageBody = document.createElement("div");
            newMessageBody.className += "their_msg msg";
            let newMessageText = document.createTextNode(this.generateRandomMessage());
            newMessageBody.appendChild(newMessageText);

            // message time
            let newTime = document.createElement("div");
            newTime.className += "msg_time";
            let newTimeText = document.createTextNode("3 semaines");
            newTime.appendChild(newTimeText);

            // image
            let newImg = document.createElement("img");
            newImg.className += "contact_pic rounded-circle";
            newImg.src = "/web/image/website_accorderie.ir_attachment_freestocks_9uvmlib0wju_unsplash_jpg/freestocks-9UVmlIb0wJU-unsplash.jpg";

            // message container
            let newMessage = document.createElement("div");
            newMessage.className += "chat_msg";
            newMessage.appendChild(newImg);
            newMessage.appendChild(newMessageBody);
            newMessage.appendChild(newTime);

            // add to chat-box
            chatBody[0].appendChild(newMessage);
        },

        generateRandomMessage: function () {
            let defaultText = "Lorem Ipsum ";
            let text="";

            for(let i = 0; i < Math.floor((Math.random() * 16)+1); i++) {
                text += defaultText;
            }

            return text;
        },
    });

    return Messagerie;
});