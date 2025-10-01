# Django Backend for Student Results Portal

This folder contains the Django backend code for the Student Academic Results Portal.

## Project Structure

```
django_backend/
├── manage.py
├── student_portal/
│   ├── __init__.py
│   ├── settings.py
│   ├── urls.py
│   ├── asgi.py
│   └── wsgi.py
├── students/
│   ├── __init__.py
│   ├── admin.py
│   ├── apps.py
│   ├── migrations/
│   ├── models.py
│   ├── serializers.py
│   ├── tests.py
│   ├── urls.py
│   └── views.py
└── results/
    ├── __init__.py
    ├── admin.py
    ├── apps.py
    ├── migrations/
    ├── models.py
    ├── serializers.py
    ├── tests.py
    ├── urls.py
    └── views.py
```

## Models

### Student Model

```python
class Student(models.Model):
    id = models.CharField(max_length=10, primary_key=True)
    name = models.CharField(max_length=100)
    branch = models.CharField(max_length=100)
    year = models.IntegerField()
    password = models.CharField(max_length=100)  # In production, use proper password hashing

    def __str__(self):
        return f"{self.id} - {self.name}"
```

### Subject Model

```python
class Subject(models.Model):
    name = models.CharField(max_length=100)
    code = models.CharField(max_length=10)
    semester = models.IntegerField()
    max_marks = models.IntegerField(default=100)
    is_lab = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.code} - {self.name}"
```

### Marks Model

```python
class Marks(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE)
    marks = models.IntegerField()
    semester = models.IntegerField()

    class Meta:
        unique_together = ('student', 'subject')

    def __str__(self):
        return f"{self.student.id} - {self.subject.name} - {self.marks}"
```

## API Endpoints

1. Student Authentication
   - `/api/auth/register/` - Register a new student
   - `/api/auth/login/` - Login a student
   - `/api/auth/logout/` - Logout a student

2. Marks Management
   - `/api/marks/` - Get all marks for the authenticated student
   - `/api/marks/<semester>/` - Get marks for a specific semester
   - `/api/marks/<semester>/update/` - Update marks for a specific semester

## Setup Instructions

1. Install Django and dependencies:
   ```
   pip install django djangorestframework django-cors-headers
   ```

2. Run migrations:
   ```
   python manage.py makemigrations
   python manage.py migrate
   ```

3. Create a superuser:
   ```
   python manage.py createsuperuser
   ```

4. Run the development server:
   ```
   python manage.py runserver
   ```

5. Access the admin panel at `http://localhost:8000/admin/`

## Integration with React Frontend

Configure CORS in Django to allow requests from the React frontend:

```python
# settings.py
INSTALLED_APPS = [
    # ...
    'corsheaders',
    # ...
]

MIDDLEWARE = [
    # ...
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    # ...
]

CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",  # React Vite development server
]
```

Ensure the frontend API service is configured to make requests to the Django backend.