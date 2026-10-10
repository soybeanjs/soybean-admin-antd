import { ref } from 'vue';
import type { Ref } from 'vue';
import { createFlatRequest } from '@sa/axios';
import type {
  AxiosError,
  CreateAxiosDefaults,
  CustomAxiosRequestConfig,
  MappedType,
  RequestInstanceCommon,
  RequestOption,
  ResponseType
} from '@sa/axios';
import useLoading from './use-loading';

export type HookRequestInstanceResponseSuccessData<ApiData> = {
  data: Ref<ApiData>;
  error: Ref<null>;
};

export type HookRequestInstanceResponseFailData<ResponseData> = {
  data: Ref<null>;
  error: Ref<AxiosError<ResponseData>>;
};

export type HookRequestInstanceResponseData<ResponseData, ApiData> = {
  loading: Ref<boolean>;
} & (HookRequestInstanceResponseSuccessData<ApiData> | HookRequestInstanceResponseFailData<ResponseData>);

export interface HookRequestInstance<
  ResponseData,
  ApiData,
  State extends Record<string, unknown>
> extends RequestInstanceCommon<State> {
  <T extends ApiData = ApiData, R extends ResponseType = 'json'>(
    config: CustomAxiosRequestConfig<R>
  ): HookRequestInstanceResponseData<ResponseData, MappedType<R, T>>;
}

/**
 * create a hook request instance
 *
 * @param axiosConfig
 * @param options
 */
export default function createHookRequest<ResponseData, ApiData, State extends Record<string, unknown>>(
  axiosConfig?: CreateAxiosDefaults,
  options?: Partial<RequestOption<ResponseData, ApiData, State>>
) {
  const request = createFlatRequest<ResponseData, ApiData, State>(axiosConfig, options);

  const hookRequest: HookRequestInstance<ResponseData, ApiData, State> = function hookRequest<
    T extends ApiData = ApiData,
    R extends ResponseType = 'json'
  >(config: CustomAxiosRequestConfig<R>) {
    const { loading, startLoading, endLoading } = useLoading();

    const data = ref(null) as Ref<MappedType<R, T>>;
    const error = ref(null) as Ref<AxiosError<ResponseData> | null>;

    startLoading();

    request<T, R>(config)
      .then(res => {
        if (res.error === null) {
          data.value = res.data;
        } else {
          error.value = res.error;
        }
      })
      .finally(endLoading);

    return {
      loading,
      data,
      error
    };
  } as HookRequestInstance<ResponseData, ApiData, State>;

  hookRequest.cancelAllRequest = request.cancelAllRequest;

  return hookRequest;
}
