FROM nginx:alpine
LABEL maintainer="NovaCRM Engineering"
LABEL description="NovaCRM static CRM dashboard"
COPY index.html /usr/share/nginx/html/
COPY app.js /usr/share/nginx/html/
COPY styles.css /usr/share/nginx/html/
COPY assets /usr/share/nginx/html/assets
COPY README.md /usr/share/nginx/html/
RUN echo "ok" > /usr/share/nginx/html/health
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
