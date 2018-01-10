from django.conf.urls import url
from robotApi import views, base_comp, composite_comp

urlpatterns = [
    url(r'^api/component/list/$', views.componentList),
    url(r'^api/component/create/$', views.createComponent),
    url(r'^api/component/addSubcomponent/$', views.addSubcomponent),
    url(r'^api/component/addConnection/$', views.addConnection),
    url(r'^api/component/addCutoutConnection/$', views.addCutoutConnection),
    url(r'^api/component/addTab/$', views.addTabConnection),
    url(r'^api/component/builderFileSave/$', views.builderFileSave),
    url(r'^api/component/make/$', views.make),
    url(r'^api/component/svg/$', views.getSVG),
    url(r'^api/component/download/svg/$', views.downloadSVG),
    url(r'^api/component/fixEdgeInterface/$', views.fixEdgeInterface),
    url(r'^api/component/constrainParameter/$', views.constrainParameter),
    url(r'^api/component/download/yaml/$', views.downloadYaml),
    url(r'^api/component/addParameter/$', views.addParameter),
    url(r'^api/component/delSubcomponent/$', views.delSubcomponent),
    url(r'^api/component/delParameter/$', views.delParameter),
    url(r'^api/component/delInterface/$', views.delInterface),
    url(r'^api/component/inheritInterface/$', views.inheritInterface),
    url(r'^api/component/save/$', views.componentSave),
    url(r'^api/component/export_code/$', base_comp.export_code),
    url(r'^api/component/export_builder/$', composite_comp.export_builder),
    url(r'^api/component/builderFileLoad/$', views.builderFileLoad)
]
