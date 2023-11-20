<?php

use Twig\Environment;
use Twig\Error\LoaderError;
use Twig\Error\RuntimeError;
use Twig\Markup;
use Twig\Sandbox\SecurityError;
use Twig\Sandbox\SecurityNotAllowedTagError;
use Twig\Sandbox\SecurityNotAllowedFilterError;
use Twig\Sandbox\SecurityNotAllowedFunctionError;
use Twig\Source;
use Twig\Template;

/* @nucleus/content/position.html.twig */
class __TwigTemplate_b38df24b3c52cf756efc210f2f5228f2323d8aa6f31ee39209d6cef278a89a07 extends \Twig\Template
{
    public function __construct(Environment $env)
    {
        parent::__construct($env);

        $this->parent = false;

        $this->blocks = [
        ];
    }

    protected function doDisplay(array $context, array $blocks = [])
    {
        // line 1
        try {            // line 2
            echo "    ";
            if ( !($context["particle"] ?? null)) {
                // line 3
                echo "        ";
                $context["enabled"] = $this->getAttribute($this->getAttribute(($context["gantry"] ?? null), "config", []), "get", [0 => (("particles." . $this->getAttribute(($context["segment"] ?? null), "type", [])) . ".enabled"), 1 => 1], "method");
                // line 4
                echo "        ";
                $context["particle"] = $this->getAttribute($this->getAttribute(($context["gantry"] ?? null), "config", []), "getJoined", [0 => ("particles." . $this->getAttribute(($context["segment"] ?? null), "type", [])), 1 => $this->getAttribute(($context["segment"] ?? null), "attributes", [])], "method");
                // line 5
                echo "    ";
            }
            // line 6
            echo "
    ";
            // line 7
            ob_start();
            // line 8
            echo "        ";
            if ((($context["enabled"] ?? null) && ((null === $this->getAttribute($this->getAttribute(($context["segment"] ?? null), "attributes", []), "enabled", [])) || $this->getAttribute($this->getAttribute(($context["segment"] ?? null), "attributes", []), "enabled", [])))) {
                // line 9
                echo "            ";
                $this->loadTemplate([0 => (("particles/" . (($this->getAttribute(($context["segment"] ?? null), "subtype", [], "any", true, true)) ? (_twig_default_filter($this->getAttribute(($context["segment"] ?? null), "subtype", []), "position")) : ("position"))) . ".html.twig"), 1 => (("@particles/" . (($this->getAttribute(                // line 10
($context["segment"] ?? null), "subtype", [], "any", true, true)) ? (_twig_default_filter($this->getAttribute(($context["segment"] ?? null), "subtype", []), "position")) : ("position"))) . ".html.twig")], "@nucleus/content/position.html.twig", 9)->display($context);
                // line 11
                echo "        ";
            }
            // line 12
            echo "    ";
            $context["html"] = ('' === $tmp = ob_get_clean()) ? '' : new Markup($tmp, $this->env->getCharset());
            // line 14
            if (twig_trim_filter(($context["html"] ?? null))) {
                // line 15
                echo "        ";
                if (($this->getAttribute(($context["gantry"] ?? null), "debug", []) && $this->getAttribute($this->getAttribute(($context["segment"] ?? null), "attributes", []), "key", []))) {
                    echo "<!-- START POSITION ";
                    echo twig_escape_filter($this->env, $this->getAttribute($this->getAttribute(($context["segment"] ?? null), "attributes", []), "key", []), "html", null, true);
                    echo " -->";
                }
                // line 16
                echo "
        <div class=\"g-content";
                // line 17
                (($this->getAttribute(($context["segment"] ?? null), "classes", [])) ? (print (twig_escape_filter($this->env, (" " . twig_escape_filter($this->env, twig_join_filter($this->getAttribute(($context["segment"] ?? null), "classes", []), " "))), "html", null, true))) : (print ("")));
                echo "\">
            ";
                // line 18
                echo ($context["html"] ?? null);
                echo "
        </div>
        ";
                // line 20
                if (($this->getAttribute(($context["gantry"] ?? null), "debug", []) && $this->getAttribute($this->getAttribute(($context["segment"] ?? null), "attributes", []), "key", []))) {
                    echo "<!-- END POSITION ";
                    echo twig_escape_filter($this->env, $this->getAttribute($this->getAttribute(($context["segment"] ?? null), "attributes", []), "key", []), "html", null, true);
                    echo " -->";
                }
                // line 21
                echo "    ";
            }
            // line 22
            echo "
";
        } catch (\Exception $e) {
            if ($context['gantry']->debug()) throw $e;
            if (\GANTRY_DEBUGGER) \Gantry\Debugger::addException($e);
            $context['e'] = $e;
            // line 24
            echo "    <div class=\"alert alert-error\"><strong>Error</strong> while rendering ";
            echo twig_escape_filter($this->env, (($this->getAttribute(($context["segment"] ?? null), "subtype", [], "any", true, true)) ? (_twig_default_filter($this->getAttribute(($context["segment"] ?? null), "subtype", []), "position")) : ("position")), "html", null, true);
            echo ".</div>
";
        }
    }

    public function getTemplateName()
    {
        return "@nucleus/content/position.html.twig";
    }

    public function isTraitable()
    {
        return false;
    }

    public function getDebugInfo()
    {
        return array (  98 => 24,  91 => 22,  88 => 21,  82 => 20,  77 => 18,  73 => 17,  70 => 16,  63 => 15,  61 => 14,  58 => 12,  55 => 11,  53 => 10,  51 => 9,  48 => 8,  46 => 7,  43 => 6,  40 => 5,  37 => 4,  34 => 3,  31 => 2,  30 => 1,);
    }

    /** @deprecated since 1.27 (to be removed in 2.0). Use getSourceContext() instead */
    public function getSource()
    {
        @trigger_error('The '.__METHOD__.' method is deprecated since version 1.27 and will be removed in 2.0. Use getSourceContext() instead.', E_USER_DEPRECATED);

        return $this->getSourceContext()->getCode();
    }

    public function getSourceContext()
    {
        return new Source("{% try %}
    {% if not particle %}
        {% set enabled = gantry.config.get('particles.' ~ segment.type ~ '.enabled', 1) %}
        {% set particle = gantry.config.getJoined('particles.' ~ segment.type, segment.attributes) %}
    {% endif %}

    {% set html %}
        {% if enabled and (segment.attributes.enabled is null or segment.attributes.enabled) %}
            {% include ['particles/' ~ segment.subtype|default('position') ~ '.html.twig',
            '@particles/' ~ segment.subtype|default('position') ~ '.html.twig'] %}
        {% endif %}
    {% endset %}

    {%- if html|trim %}
        {% if gantry.debug and segment.attributes.key %}<!-- START POSITION {{ segment.attributes.key }} -->{% endif %}

        <div class=\"g-content{{ segment.classes ? ' ' ~ segment.classes|join(' ')|e }}\">
            {{ html|raw }}
        </div>
        {% if gantry.debug and segment.attributes.key %}<!-- END POSITION {{ segment.attributes.key }} -->{% endif %}
    {% endif %}

{% catch %}
    <div class=\"alert alert-error\"><strong>Error</strong> while rendering {{ segment.subtype|default('position') }}.</div>
{% endtry %}
", "@nucleus/content/position.html.twig", "D:\\MAMP\\htdocs\\grav\\user\\plugins\\gantry5\\engines\\nucleus\\templates\\content\\position.html.twig");
    }
}
