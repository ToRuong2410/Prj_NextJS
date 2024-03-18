export {};
// https://bobbyhadz.com/blog/typescript-make-types-global#declare-global-types-in-typescript

declare global {
  // kiểu type bài nhạc
  interface ITrackTop {
    _id: string;
    title: string;
    description: string;
    category: string;
    imgUrl: string;
    trackUrl: string;
    countLike: number;
    countPlay: number;
    uploader: {
      _id: string;
      email: string;
      name: string;
      role: string;
      type: string;
    };
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
  }

  // kiểu type dùng để fetch dữ liệu
  interface IRequest {
    url: string;
    method: string;
    body?: { [key: string]: any };
    queryParams?: any;
    useCredentials?: boolean;
    headers?: any;
    nextOption?: any;
  }

  // type của BE
  interface IBackendRes<T> {
    error?: string | string[];
    message: string;
    statusCode: number | string;
    data?: T;
  }

  // Kiểu type khi giá trị lấy đi hoặc trả về dùng để phân trang, có thể định nghĩa thêm kiểu
  // type cho result
  interface IModelPaginate<T> {
    meta: {
      current: number;
      pageSize: number;
      pages: number;
      total: number;
    };
    result: T[];
  }

  // kế thừa lại interface ITrackTop
  interface IShareTrack extends ITrackTop {
    isPlaying: boolean;
  }

  // định nghĩa kiểu type cho Context-React
  interface ITrackContext {
    currentTrack: IShareTrack;
    setCurrentTrack: (value: IShareTrack) => void;
  }

  // định nghĩa kiểu type cho Comments
  interface ITrackComment {
    _id: string;
    content: string;
    moment: number;
    user: {
      _id: string;
      email: string;
      name: string;
      role: string;
      type: string;
    };
    track: {
      _id: string;
      title: string;
      description: string;
      trackUrl: string;
    };
    isDeleted: false;
    __v: number;
    createdAt: string;
    updatedAt: string;
  }

  interface ITrackLike {
    _id: string;
    title: string;
    description: string;
    category: string;
    imgUrl: string;
    trackUrl: string;
    countLike: number;
    countPlay: number;
    createdAt: string;
    updatedAt: string;
  }
}
