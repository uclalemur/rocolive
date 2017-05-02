from django.conf.urls import url
from . import views

urlpatterns = [
    url(r'^$', views.index, name='index'),

    url(r'^prevblocks/$', views.prevblocks, name='prevblocks'),

    # ex: /interface/save
    url(r'^save/$', views.save, name='save'),
    # ex: /interface/recall_session#12
    url(r'^recall_session/$', views.recall_session, name='recall'),
    # ex: /interface/export_code
    url(r'^export_code/$', views.export_code, name='export'),

    # ex: /interface/export_Builder
    url(r'^prevblocks/export_builder/$',
        views.export_builder, name='exportbuilder'),

    # ex: /interface/get_code
    url(r'^prevblocks/get_zip_(?P<code>.+)/$', views.get_code, name='getcode'),

    url(r'^prevblocks/CC(?P<code>.+)/$', views.get_cc_save, name='getccsave'),

    url(r'^prevblocks/prev_list/$', views.prev_list, name='prevlist'),

    url(r'^prevblocks/prev_load/$', views.prev_load, name='prevload'),

    url(r'^prevblocks/prev_save_check/$', views.prev_save_check, name='prevsavecheck'),

    url(r'^prevblocks/prev_save/$', views.prev_save, name='prevsave'),

    url(r'^prev_save_check/$', views.prev_save_check, name='prevsavecheck'),

    url(r'^BP(?P<code>.+)/$', views.get_bp_save, name='getbpsave'),

    url(r'^prev_save/$', views.prev_save, name='prevsave'),

    url(r'^prev_list/$', views.prev_list, name='prevlist'),

    url(r'^prev_load/$', views.prev_load, name='prevload'),

    # ex: /interface/5/results/
    # url(r'^(?P<question_id>[0-9]+)/results/$', views.results, name='results'),
    # ex: /interface/5/vote/
    # url(r'^(?P<question_id>[0-9]+)/vote/$', views.vote, name='vote'),
]
