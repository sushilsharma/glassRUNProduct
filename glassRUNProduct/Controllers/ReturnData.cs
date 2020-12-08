using System.Collections.Generic;

namespace glassRUNProduct.WebAPI
{
    public class ReturnData<T>
    {
        private List<T> _data;

        private string _totalRecords;

        public List<T> data
        {
            get { return _data; }
            set { _data = value; }
        }
        public string totalRecords
        {
            get { return _totalRecords; }
            set { _totalRecords = value; }
        }
    }
}