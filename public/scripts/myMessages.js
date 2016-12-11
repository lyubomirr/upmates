<% for( var i = 0; i < messages.length; i++ ) { %>
    $("#<%=messages[i]._id%>").click(function() {
            $("#message-text").text(`<%=messages[i].body%>`);
            $("#sender").text("<%=messages[i].sender.firstName%> <%=messages[i].sender.lastName%>");
            $("#sender-email").text("<%=messages[i].sender.email%>");
            $("#message-title").text("<%=messages[i].title%>");
            $("#to").text("<%=messages[i].sender.firstName%> <%=messages[i].sender.lastName%>");
            $("#send-form").attr("action", "/profile/id/<%=messages[i].sender.id%>/send-message/from-messenger");
        });
<% } %>
$('#send-message').click(function() {
    $('#messageBox').fadeIn(300); 
});
$('#close').click(function() {
   $('#messageBox').fadeOut(300); 
});