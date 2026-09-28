FROM php:8.2-fpm

LABEL maintainer="example@example.org"

RUN apt-get update && apt-get install -y \
    curl \
    wget \
    git \
    libonig-dev \
    libzip-dev \
    zip \
    unzip \
    && rm -rf /var/lib/apt/lists/*

RUN docker-php-ext-install -j$(nproc) iconv mbstring mysqli pdo pdo_mysql zip

RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

ADD php.ini /usr/local/etc/php/conf.d/40-custom.ini

WORKDIR /var/www

CMD ["php-fpm"]