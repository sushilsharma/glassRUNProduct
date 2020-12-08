﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http.WebHost;
using System.Web.Routing;
using System.Web.SessionState;

namespace glassRUNProduct.WebAPI.Infrastructure
{
    public class SessionEnabledControllerHandler : HttpControllerHandler, IRequiresSessionState
    {
        public SessionEnabledControllerHandler(RouteData routeData)
            : base(routeData)
        { }
    }
}