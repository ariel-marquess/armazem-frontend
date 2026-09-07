# Configuração do Proxy Reverso

O atual projeto é fruto na verdade de um trabalho da matéria de Redes de Computadores do curso que estamos participando. Objetivamente, a ideia é simular, utilizando máquinas virtuais, a atuação de um proxy reverso nos processos de comunicação entre usuário e servidor.

Para alcançarmos esse objetivo precisamos instalar em nosso ecossistema de produção um servidor de proxy reverso, que neste caso estamos utilizando o [Nginx](https://www.nginx.com/).

## Requisitos para configuração

- Possuir o programa VirtualBox instalado em sua máquina física;
- Ter quatro máquinas virtuais devidamente configuradas no VirtualBox;
- Utilizar o sistema operacional <a href="https://drive.google.com/drive/folders/18OHcenvD4wDcidbX7M_UCOB8A9IsVbcN?usp=sharing" target="_blank">Debian</a> nas máquinas virtuais.

> **Observação sobre a rede interna:**  
> Para o funcionamento esperado na rede interna, considere a seguinte configuração de IP:
>
> - **Máquina do servidor de proxy reverso:** `192.168.0.1`
> - **Máquina da aplicação:** `192.168.0.2`
> - **Máquina da API:** `192.168.0.3`
> - **Máquina do servidor de banco de dados:** `192.168.0.4`
>
> Certifique-se de que a configuração de rede das máquinas virtuais permite a comunicação entre ambas.

Obs.: Neste documento não apresentaremos como configurar as máquinas da API e do banco de dados, os passos para configuração destas já estão documentados no <a href="https://github.com/Ricardo-Bessa-dev/Back-End-Sistema-Armazem.git" target="_blank">repositório da API</a>.

## Configurando máquina do servidor de proxy reverso

No terminal do Debian, siga os próximos passos para que possamos configurar a máquina virtual que servirá como servidor do proxy reverso.

### Instalando o Nginx

A configuração da máquina virtual inicia exclusivamente pela instalação do NGINX. Vamos iniciar esta série de passos verificando e baixando novas atualizações nos pacotes do sistema operacional:

```bash
sudo apt update && sudo apt upgrade
```

Caso alguma atualização seja necessária, o terminal solicitará sua confirmação para realização das instalações; confirme e espere que o processo termine.

Vamos agora instalar o proxy reverso. Execute o seguinte comando:

```bash
sudo apt install nginx -y
```

### Configurando o Nginx

Para realizar a configuração do servidor de proxy reverso, execute o seguinte comando:

```bash
sudo nano /etc/nginx/sites-enabled/default
```

O arquivo que você entrar será o arquivo de configuração padrão do Nginx. Para que a configuração seja finalizada, no contexto em que foi desenvolvido este projeto, digite o seguinte bloco de código no arquivo:

```text
server {
    listen 80;
    server_name 192.168.0.1;

    location / {
        proxy_pass http://192.168.0.2:5173;                                # Aqui deve ser apontado o endereço e a porta de onde está sendo executada a aplicação
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Esse código define quem será o servidor de proxy reverso dentro da rede interna, e, quando acessado, passará suas requisições para o endereço da aplicação. Além do mecanismo de roteamento, adicionamos alguns cabeçalhos que possibilitarão o pleno funcionamento do ecossistema, mesmo quando a aplicação está sendo executada em modo de desenvolvimento.

Agora, teste e reinicie o NGINX:

```bash
sudo nginx -t                     # Para testar
```

```bash
sudo systemctl restart nginx      # Para reiniciar
```

Pronto! Seu proxy reverso já está funcionando.