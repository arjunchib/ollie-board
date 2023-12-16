interface Env {
  BUCKET: R2Bucket;
}

export const onRequest: PagesFunction<Env> = async (context) => {
  const [stream1, stream2] = context.request.body.tee();
  const filename = new Date().toISOString() + '.png';
  await Promise.all([
    await context.env.BUCKET.put('latest.png', stream1),
    await context.env.BUCKET.put(filename, stream2),
  ]);
  await fetch('https://ollie.arjunchib.com/webhook', {
    method: 'POST',
    body: JSON.stringify({ image: filename }),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return new Response('ok');
};
