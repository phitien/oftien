const tracking_id = "UA-138092830-1";
jQuery
  .getScript(`https://www.googletagmanager.com/gtag/js?id=${tracking_id}`)
  .done(function(script, textStatus) {
    gtag("js", new Date());
    gtag("config", tracking_id);
  })
  .fail(function(jqxhr, settings, exception) {
    console.lg(`Cannot load google analytics for ${tracking_id}`);
  });
