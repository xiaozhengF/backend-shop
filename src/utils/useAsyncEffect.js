import {useEffect} from 'react'

export default function useAsyncEffect(method,dep){
    return useEffect(() => {
        const cleanupPromise = method()
        return () => { cleanupPromise.then(cleanup => cleanup && cleanup()) }
      }, dep)
}