from django.test import TestCase
# Create your tests here.
from django.utils import timezone

today = timezone.now().date()
print(today)