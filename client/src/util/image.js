
  export default {
    format_path : function(path){
        if(!path || path == "default_avatar") 
            path = "/static/default_avatar.jpg";
        console.log("format_path",path);
        return path;
    }
  };
  