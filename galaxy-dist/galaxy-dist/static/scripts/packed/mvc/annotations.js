var Annotation=BaseModel.extend(LoggableMixin).extend({logger:console,toString:function(){return"Annotation()"}});var AnnotationView=BaseView.extend(LoggableMixin).extend({logger:console,toString:function(){return"AnnotationView()"}});