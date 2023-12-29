# Install the base requirements for the app.
# This stage is to support development.
FROM python:3.10.7-slim-buster
WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

RUN pip install --upgrade pip
COPY . .
RUN pip install -r requirements.txt

# create the app user
RUN addgroup --system app && adduser --system --group app
# chown all the files to the app user
RUN chown -R app:app .
# change to the app user
USER app

CMD gunicorn -w 2 wsgi:app -b 0.0.0.0:2000