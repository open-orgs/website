import { Hono } from 'hono';
import { pages } from './routes/pages';
import { sign } from './routes/sign';
import { consultation } from './routes/consultation';

/**
 * Static files under public/ (token CSS, the JS islands, the favicon) are served by Workers
 * Assets before this Worker runs, so nothing here has to route them.
 */
const app = new Hono<{ Bindings: Env }>();

app.route('/', pages);
app.route('/', sign);
app.route('/', consultation);

app.notFound((c) => c.text('Not Found', 404));

export default app;
