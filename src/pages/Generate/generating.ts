export type GenerateState = null | 'processing' | 'completed' | 'error';

export async function generateAndDownload(
  setState: (state: GenerateState) => void,
  size: number = 1,
  withErrors: 'on' | 'off' = 'off',
  maxSpend: number = 1000
) {
  setState('processing');

  const url = new URL('http://localhost:3000/report');
  url.searchParams.set('size', size.toString());
  url.searchParams.set('withErrors', withErrors);
  url.searchParams.set('maxSpend', maxSpend.toString());

  let response;
  try {
    response = await fetch(url.toString());
  } catch (e) {
    setState('error');
    return;
  }
  if (!response.ok) {
    setState('error');
    return;
  }

  const blob = await response.blob();

  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'report.csv';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
  setState('completed');
}
