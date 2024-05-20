# Скрипт по созданию студентов в keycloak и отправка письма им на почту

## Требования

1. Nodejs
2. npm
3. Makefile

## Инструкция

Создаем в корневой директории **users.csv**, и запускаем скрипт.

### Пример CSV

```csv
username,firstName,lastName,email,enabled,credential_type,credential_value,credential_temporary
testStudent,test,student,example_mail1@gmail.com,true,password,example_mail1,false
testStudent2,test2,student2,example_mail2@gmail.com,true,password,example_mail2,false
```

## Запуск и установка

1. Установка

```bash
make install
```

2. Запуск

```bash
make run
```