<samp>

### Esercitazione: .NET / Angular / ReactJs - Web API

---
#### Realizzare un servizio REST Web Api per la gestione di testi e librerie

1. Ottenere l'elenco delle biblioteche
2. Ottenere tutti i libri per una certa biblioteca
3. Ottenere un libro specifico dato il suo ID
4. Aggiungere un nuovo libro 
5. Modificare un libro esistente - (FALTA RENDERIZAR EN EL FRONT)
6. Eliminare un libro - (FALTA ACTUALIZAR RENDERIZACION EN EL FORNT)
7. Implementa la paginazione per limitare il numero di libri restituiti in una singola chiamata.
Esempio:
    GET /api/libri?pagina=1&dimensionePagina=10: Restituisce i primi 10 libri della prima pagina.
    GET /api/libri?pagina=2&dimensionePagina=10: Restituisce i successivi 10 libri della seconda pagina, e così via.


##### Suggerimenti

- Utilizza il metodo async/await per gestire le operazioni asincrone
- Assicurati di gestire gli errori e restituire le risposte HTTP appropriate in caso di successo o fallimento delle operazioni
- Implementa la gestione delle eccezioni per gli errori comuni, come ad esempio richieste non valide o libri non trovati

##### Bonus

- Aggiungi la possibilità di eseguire una ricerca testuale per titolo o autore dei libri.
- Aggiungi la possibilità di ordinare i libri per titolo o per anno di pubblicazione.
- Aggiungi autenticazione e autorizzazione per proteggere gli endpoint sensibili della Web API.

Solo gli utenti autenticati e autorizzati possono accedere agli endpoint di modifica o eliminazione dei libri.

</samp>