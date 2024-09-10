from django.contrib import admin
from api.models import Files,User
from django.contrib.auth.admin import UserAdmin
# Register your models here.

class AccountAdmin(UserAdmin):
    # add_form = UserCreateForm
    list_display = ["email","first_name","last_name","date_joined"]
    search_fields = ["email","first_name"]
    readonly_fields = ["date_joined","last_login"]
    
    filter_horizontal = ()
    list_filter = ()
    fieldsets = ()
    ordering =()

admin.site.register(User,AccountAdmin)

admin.site.register(Files)
