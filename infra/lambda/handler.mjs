// Lambda — handler.mjs
// Consome a API via API Gateway e retorna estatísticas
// NÃO acessa o RDS diretamente (conforme requisito do projeto)

export const handler = async (event) => {
  const API_URL = process.env.API_BASE_URL; // URL do API Gateway, ex: https://xxxx.execute-api.us-east-1.amazonaws.com/prod

  try {
    const response = await fetch(`${API_URL}/events`);

    if (!response.ok) {
      throw new Error(`API respondeu com status ${response.status}`);
    }

    const events = await response.json();

    // --- Estatísticas geradas pela Lambda ---
    const totalEvents = events.length;

    const byCategory = events.reduce((acc, ev) => {
      acc[ev.category] = (acc[ev.category] || 0) + 1;
      return acc;
    }, {});

    const byCity = events.reduce((acc, ev) => {
      acc[ev.city] = (acc[ev.city] || 0) + 1;
      return acc;
    }, {});

    const avgPrice = totalEvents > 0
      ? (events.reduce((sum, ev) => sum + parseFloat(ev.price), 0) / totalEvents).toFixed(2)
      : 0;

    const mostExpensive = events.reduce((max, ev) =>
      parseFloat(ev.price) > parseFloat(max?.price || 0) ? ev : max, null
    );

    const cheapest = events.reduce((min, ev) =>
      parseFloat(ev.price) < parseFloat(min?.price || Infinity) ? ev : min, null
    );

    const totalTickets = events.reduce((sum, ev) => sum + ev.total_tickets, 0);
    const availableTickets = events.reduce((sum, ev) => sum + ev.available_tickets, 0);
    const soldTickets = totalTickets - availableTickets;

    // Próximos eventos (data futura)
    const now = new Date();
    const upcomingEvents = events
      .filter(ev => new Date(ev.event_date) > now)
      .sort((a, b) => new Date(a.event_date) - new Date(b.event_date))
      .slice(0, 3)
      .map(ev => ({ id: ev.id, name: ev.name, city: ev.city, event_date: ev.event_date }));

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({
        generated_at: new Date().toISOString(),
        summary: {
          total_events: totalEvents,
          average_price_brl: parseFloat(avgPrice),
          total_tickets: totalTickets,
          available_tickets: availableTickets,
          sold_tickets: soldTickets,
          occupancy_rate_pct: totalTickets > 0
            ? ((soldTickets / totalTickets) * 100).toFixed(1)
            : '0.0',
        },
        by_category: byCategory,
        by_city: byCity,
        highlights: {
          most_expensive: mostExpensive
            ? { id: mostExpensive.id, name: mostExpensive.name, price: mostExpensive.price }
            : null,
          cheapest: cheapest
            ? { id: cheapest.id, name: cheapest.name, price: cheapest.price }
            : null,
        },
        upcoming_events: upcomingEvents,
      }),
    };
  } catch (err) {
    console.error('Erro na Lambda /report:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Erro ao gerar relatório', detail: err.message }),
    };
  }
};
