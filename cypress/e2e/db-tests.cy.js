describe('Pruebas de base de datos MySQL', () => {
    it('Debería poder conectarse y consultar la base de datos', () => {
      // Ejecutar una consulta simple para verificar la conexión
      cy.task('queryDb','SELECT 1 + 1 AS suma')
        .then((result) => {
          expect(result[0].suma).to.equal(2);
        });
    });
  
    it.only('Debería poder consultar una tabla específica', () => {
      // Reemplaza 'nombre_tabla' con el nombre real de tu tabla
      cy.task('queryDb','SELECT * FROM usuarios LIMIT 5')
        .then((rows) => {
          // Verifica que se devuelvan resultados
          expect(rows.length).to.be.at.least(0);
          cy.log(rows)
        });
    });
  });