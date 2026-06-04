import { proxyMapIrSearch } from "../_proxy";

export async function POST(request) {
  return proxyMapIrSearch(request, "/autocomplete");
}
