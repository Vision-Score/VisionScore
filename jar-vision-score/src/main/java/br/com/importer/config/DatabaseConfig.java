package br.com.importer.config;

import br.com.importer.exception.ImportacaoException;
import br.com.importer.util.EnvLoader;
import org.apache.commons.dbcp2.BasicDataSource;
import org.springframework.jdbc.core.JdbcTemplate;

/**
 * Configuração do banco de dados MySQL via Spring JDBC.
 * Lê as credenciais do arquivo .env via EnvLoader.
 */
public class DatabaseConfig {

    public JdbcTemplate getJdbcTemplate() {
        String url      = EnvLoader.get("DB_URL");
        String username = EnvLoader.get("DB_USERNAME");
        String password = EnvLoader.get("DB_PASSWORD", "");

        if (url == null || url.isBlank()) {
            throw new ImportacaoException("DB_URL não definido no arquivo .env");
        }
        if (username == null || username.isBlank()) {
            throw new ImportacaoException("DB_USERNAME não definido no arquivo .env");
        }

        BasicDataSource dataSource = new BasicDataSource();
        dataSource.setUrl(url);
        dataSource.setUsername(username);
        dataSource.setPassword(password);
        dataSource.setDriverClassName("com.mysql.cj.jdbc.Driver");

        // Pool de conexões
        dataSource.setInitialSize(2);
        dataSource.setMaxTotal(10);
        dataSource.setMaxIdle(5);
        dataSource.setMinIdle(1);

        // Valida conexão antes de usar
        dataSource.setTestOnBorrow(true);
        dataSource.setValidationQuery("SELECT 1");

        return new JdbcTemplate(dataSource);
    }
}
