# Используем официальный образ MariaDB
FROM mariadb:latest

# Устанавливаем мета-информацию
LABEL maintainer="your-name"
LABEL description="MariaDB container with custom configuration"

# Копируем SQL скрипты для инициализации
COPY init-scripts/ /docker-entrypoint-initdb.d/

# Делаем скрипты исполняемыми
RUN chmod -R 755 /docker-entrypoint-initdb.d/

# Открываем порт MySQL
EXPOSE 3306

# Используем стандартный entrypoint от официального образа
CMD ["mysqld"]