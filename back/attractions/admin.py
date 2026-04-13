from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import Attraction, Category, User


@admin.register(User)
class UserAdmin(BaseUserAdmin):
	fieldsets = BaseUserAdmin.fieldsets + (
		('Game profile', {'fields': ('points', 'profile_picture')}),
	)
	list_display = ('username', 'email', 'points', 'is_staff')


admin.site.register(Category)
admin.site.register(Attraction)
