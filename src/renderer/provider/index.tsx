import { useEffect, useState } from 'react';
import Main from '../pages';

import { useApiList } from '../hooks/useApiList';

function Provider() {
  const { apiList } = useApiList()
  return <Main />;
}

export default Provider;
