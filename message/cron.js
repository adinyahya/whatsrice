const cron = require('node-cron');

module.exports = function (db, sessionMap, startDEVICE) {
    cron.schedule('*/1 * * * * *', function () {
        console.log('cronjob berjalan');
       
        var datetime = new Date();
        var dateString = new Date(
          datetime.getTime() - datetime.getTimezoneOffset() * 60000
        );
        var curr_time = dateString.toISOString().replace("T", " ").substr(0, 19);
        var string_curr_time = "'" +curr_time+ "'";
        // console.log('Tanggal realtime : ' + string_curr_time)
        

    });
};